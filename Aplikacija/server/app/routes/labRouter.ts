import {Router} from "express";
import lab from "../models/lab";
import Student from "../models/student";
import Lab from "../models/lab";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";
import Tema, { ISubject } from "../models/subject";
import mongoose, { AnyBulkWriteOperation } from "mongoose";
import Classroom from "../models/classroom";
import Computer, { IComputer } from "../models/computer";
import ClassSession, { IClassSession } from "../models/classSession";
import StudentEntry from "../models/studentEntry";

const labRouter = Router();

labRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else{
        const found = await Lab.find({})
         .populate({
                path: 'subjects',
                populate: {
                    path: 'sessions',
                    populate: {
                        path: 'classroom',
                        populate: {
                            path: 'computers.student'
                        }
                    }
                }
            }).exec();

        found != null ? 
        res.status(200).send(found) : 
        res.status(404).send({message: "labs not found"});
    }

}); 

labRouter.post("/add", authorizeToken, async (req: any, res) => {
    if (!verifyToken(req.token)) {
        return res.status(403).send({ message: "Invalid token" });
    }

    let { labName, desc, mandatory, subjectNum, Subjects, maxPoints, classroom,
         studentList, timeSlots, autoSchedule, maxSubjPoints } = req.body;

    console.log(req.body);

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    console.log(Subjects);

    const name = `${labName}_${currentYear}/${nextYear}`;
    
    try {
        let subjects: mongoose.Types.ObjectId[] = [];
        const attendances = Array(subjectNum).fill(false);
        const points = Array(subjectNum).fill(0);

        let studentEntryPromises = studentList.map(async (student:any) => {
         const entrytoAdd:any = new StudentEntry(
                {student:student._id, attendance:attendances,points, labName:name})
            let savedEntry:any;
            try{
                savedEntry = await entrytoAdd.save();        
            }
            catch(err){
                console.log(err);
                return res.status(400).send({ message: "Error adding studentEntry" });
            }
            return savedEntry?._id;            
        });

        const classroomRef:any = await Classroom.findOne({_id:classroom});
        const studentEntryList = await Promise.all(studentEntryPromises);

        for (let i = 0; i < subjectNum; ++i) {
            let sessions: any[] = [];
            for (let j = 0; j < timeSlots.length; ++j) {              
                let datum = Subjects[i].date.split('T')[0];
                let computers: IComputer[][] = [];
                let sname = `${classroomRef.name}_${datum}/${timeSlots[j]}`;
                
                const existingClassroom = await Classroom.findOne({ name: sname });
                if (existingClassroom) {                  
                    return res.status(400).send({ message: `Classroom with name ${sname} already exists` });
                }

                for (let r = 0; r < classroomRef.rows; ++r) {
                    const rowComputers: IComputer[] = [];
                    for (let c = 0; c < classroomRef.cols; ++c) {
                        let computer:any;
                        if(autoSchedule) {
                            if((!classroomRef.computers[r][c].malfunctioned &&
                                ((r*classroomRef.cols+c+j*(classroomRef.rows*classroomRef.cols)))
                                 < studentEntryList.length)) {
                                computer = new Computer({ name: `${sname}_${r}_${c}`
                            , free:false,student:studentEntryList[r*classroomRef.cols+c]});   
                            }
                            else {
                                computer = new Computer({ name: `${sname}_${r}_${c}`});
                            }                        
                        }
                        else {
                            computer = new Computer({ name: `${sname}_${r}_${c}`});
                        }
                        rowComputers.push(computer);
                    }
                    computers.push(rowComputers);
                }
                const dateTime = `${datum}T${timeSlots[j]}:00Z`;
                let time = new Date(dateTime);
                const classroom = new Classroom({ name: sname, rows:classroomRef.rows,
                     cols:classroomRef.cols, computers });
                sessions.push(new ClassSession({ classroom: classroom, time }));
            }

            const subjMaxPoints = maxSubjPoints !== undefined 
                                ? maxSubjPoints[i]
                                : maxPoints !== 0
                                ? maxPoints/subjectNum
                                : 0;

            const subDesc = Subjects[i].desc;
            console.log(subDesc);
            const date = new Date(Subjects[i].date);
            const subject = new Tema({
                ordNum: (i+1), desc: subDesc, date, sessions, maxPoints: subjMaxPoints, lab: name,
            });
            
            try {
                const savedSubject = await subject.save();
                subjects.push(savedSubject._id);
            } catch (err:any) {
                console.log(err);
                const overlap = err.keyValue['sessions.classroom.name'].split('_')[1];
                subjects.forEach(async (_id) => {
                    const deleted = await Tema.findOneAndDelete({_id});                                    
                });
                studentEntryList.forEach(async (_id) => {
                    const deleted = await StudentEntry.findOneAndDelete({_id});
                });
                return res.status(400).send({ message: `Preklapanje termina ${overlap}`});     
            }
        }

        const newLab = new Lab({
            name, desc, mandatory, subjectNum,maxPoints, classroom, subjects, studentList
        });

        try {
            const savedLab = await newLab.save();
            return res.status(200).send(savedLab);
        } catch (err) {
            console.error("Error saving lab:", err);
            return res.status(500).json({ message: "Error saving lab" });
        }

    } catch (err: any) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});




// labRouter.post("/add", authorizeToken, async (req:any, res) => {
//     if(!verifyToken(req.token)) 
//         res.status(403).send({message: "Invalid token"});
    
//     else {
//         let { labName, desc, mandatory, subjectNum, maxPoints, classroom, rows, cols, crName
//             , studentList, dates, timeSlots, subjectDescs} = req.body;

//         //console.log(subjectNum, rows, cols,crName);
//         const currentYear = new Date().getFullYear();
//         const nextYear = currentYear + 1;
//         let sessions:any[] = [];

//         const name = `${labName}_${currentYear}/${nextYear}`;
//         //console.log(subjectNum);
//         try {               
//             // O(n^4) ??!?!?!?!!??!?!!??!!?!?!? !!!!
//             let subjects:ISubject[] = [];
           
//             for(let i=0;i<subjectNum;++i) {             
//                 for(let j=0;j < timeSlots.length;++j) {
//                     let datum = dates[i].split('T')[0];
//                     //console.log("date ", datum, " / time ",timeSlots[j]);

//                     let computers: IComputer[][] = [];
//                     let sname = `${crName}_${datum}/${timeSlots[j]}`;
//                     console.log("Naziv: ", sname);
//                     for (let r = 0; r < rows; ++r) {
//                         const rowComputers: IComputer[] = [];
//                         for (let c = 0; c < cols; ++c) {
//                             const computer = new Computer({
//                                 name: `${sname}_${r}_${c}`
//                             });
                            
//                             rowComputers.push(computer);
//                         }
//                         computers.push(rowComputers);
//                     }
//                     console.log("Computers: ", computers);
//                    const classroom = new Classroom({name:sname, rows, cols, computers});                    
//                    sessions.push(new ClassSession({
//                         classroom: classroom,
//                         time: timeSlots[j]
//                     }));

//                 }

//                 const subDesc = subjectDescs[i];
//                 const date = dates[i];
//                 const subject = new Tema({ 
//                     ordNum:i, desc:subDesc, date, 
//                     sessions, maxPoints, lab:name,
//                 });
//                 try {
//                     const savedSubject = await subject.save();
//                     subjects.push(savedSubject._id);
//                 }
//                 catch(err) {
//                     console.log(err);
//                 }
                
//             }
//             const newLab = new Lab({name, desc, mandatory, maxPoints,
//                 classroom, subjects, studentList
//             }) 

//             const savedLab = await newLab.save();

//             res.status(200).send(savedLab);

//         } 
//         catch (err: any) {
//             res.status(500).json({ message: "Could not find subjects"});
//         }
//     }
        
// });

labRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
   
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else{
        const query = req.body;
        const labs = await lab.find(query).populate({
            path: 'subjects',
            populate: {
                path: 'sessions',
                populate: {
                    path: 'classroom',
                    populate: {
                        path: 'computers.student'
                    }
                }
            }
        }).exec();
        
        labs != null ?
        res.status(200).send(labs) :
        res.status(404).send({message: "labs with filter not found"});
    }
});

labRouter.patch("/update/:id", authorizeToken,async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});

    else {
        const labId = req.params.id;
        const { name, desc, mandatory, subjectNum, maxPoints, studentList, timeSlots, subjects } = req.body;
    
        if (!labId) {
            return res.status(400).send({ message: "Lab ID is required for update" });
        }
    
        try {
            const updateFields: any = {}; // Partial<ILab> ensures that only optional fields are allowed
            if (name !== undefined) updateFields.name = name;
            if (desc !== undefined) updateFields.desc = desc;
            if (mandatory !== undefined) updateFields.mandatory = mandatory;
            if (subjectNum !== undefined) updateFields.subjectNum = subjectNum;
            if (maxPoints !== undefined) updateFields.maxPoints = maxPoints;
            if (studentList !== undefined) updateFields.studentList = studentList;
            if (timeSlots !== undefined) updateFields.timeSlots = timeSlots;
    
            // Handle subjects separately if needed
    
            const result = await Lab.findByIdAndUpdate(
                labId,
                { $set: updateFields },
                { new: true, runValidators: true }
            );
    
            if (!result) {
                return res.status(404).send({ message: "Lab not found" });
            }
    
            res.status(200).send(result);
        } catch (err: any) {
            res.status(400).send({ message: `Error updating lab: ${err.message}` });
        }
    }
});

labRouter.delete("/delete/:id", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});

    else {
        try{
            const {id} = req.params;
            const entry = await Lab.findByIdAndDelete(id);
            entry != null ?
            res.status(200).send({message: `Deleted Lab with id: ${id}`}) :
            res.status(404).send({message: `No Lab with id: ${id} found`});
            
        }
        catch(err: any){
            console.log(err.message);
            return res.status(500).send({message: "Internal Server Error"});
        }
    }
});

export default labRouter;