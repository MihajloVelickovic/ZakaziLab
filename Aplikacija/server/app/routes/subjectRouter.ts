import { Router } from "express";
import Subject from "../models/subject";
import { authorizeToken, verifyToken } from "../config/tokenFuncs";
import Classroom from "../models/classroom";
import ClassSession, { IClassSession } from "../models/classSession";
import Computer, { IComputer } from "../models/computer";
import Tema from "../models/subject";

const subjectRouter = Router();

subjectRouter.post("/add", authorizeToken, async (req:any, res) => {
    let{ ordNum, desc, date, maxPoints, name,rows,cols, time,lab  } = req.body;

    if (!verifyToken(req.token))
        return res.status(403).send({ message: "Invalid token" });
    else {
        try {
           
            if (!name || !rows || !cols || !time) {
                return res.status(400).json({ message: "Classroom name, rows, cols, and time are required" });
            }

            // Create computers for the classroom
            const computers: IComputer[][] = [];
            name = `${name}_${time}`;

            for (let i = 0; i < rows; ++i) {
                const rowComputers: IComputer[] = [];
                for (let j = 0; j < cols; ++j) {
                    const computer = new Computer({
                        name: `${name}_${i}_${j}`
                    });
                    
                    rowComputers.push(computer);
                }
                computers.push(rowComputers);
            }
            const classroom = new Classroom({name, rows, cols, computers});
           
            let sessions:IClassSession[] = [];
            sessions.push(new ClassSession({
                classroom: classroom,
                time: time
            }));


            const subject = new Subject({ 
                ordNum, desc, date, 
                sessions, maxPoints, lab
             });

             const savedSubject = await subject.save();

            res.status(201).json(savedSubject);
        } catch (err: any) {
            res.status(500).json({ message: "Could not find subjects"});
        }
    }
});

subjectRouter.patch("/updateComputer", authorizeToken, async (req: any, res) => {
    try {
        if (!verifyToken(req.token)) {
            return res.status(403).send({ message: "Invalid token" });
        }

        const { subjectId, sessionId, computer } = req.body;

        const subject = await Tema.findById(subjectId);
        if (!subject) {
            return res.status(404).send({ message: "Subject not found" });
        }

        const session = subject.sessions.find(s => s._id.toString() === sessionId);
        if (!session) {
            return res.status(404).send({ message: "Session not found" });
        }

        const updatedComputers = session.classroom.computers.map(computerRow => {
            return computerRow.map(comp => {
                if (comp.name === computer.name) {
                    return new Computer({name:computer.name,malfunctioned:computer.malfunctioned,
                        malfunctionDesc:computer.malfunctionDesc, free:computer.free,
                        student:computer.student
                    });
                }
                return comp;
            });
        });


        session.classroom.computers = updatedComputers;

        await subject.save();

        return res.status(200).send({ message: "Computer updated successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).send({ message: "Internal server error" });
    }
});


subjectRouter.patch("/update/:id", authorizeToken, async (req:any, res) => {
    if(!verifyToken(req.token)) 
        res.status(403).send({message: "Invalid token"});
    else {
        const subjectId = req.params.id;
        const { ordNum, desc, date, sessions, maxPoints, studentList } = req.body;

        if (!subjectId) {
            return res.status(400).send({ message: "Subject ID is required for update" });
        }

        try {
                const updateFields: any = {};
                if (ordNum !== undefined) updateFields.ordNum = ordNum;
                if (desc !== undefined) updateFields.desc = desc;
                if (date !== undefined) updateFields.date = date;
                if (sessions !== undefined) updateFields.sessions = sessions;
                if (maxPoints !== undefined) updateFields.maxPoints = maxPoints;
                if (studentList !== undefined) updateFields.studentList = studentList;

                const result = await Subject.findByIdAndUpdate(
                    subjectId,
                    { $set: updateFields },
                    { new: true, runValidators: true }
                );

                if (!result) {
                    return res.status(404).send({ message: "Subject not found" });
                }

                res.status(200).json(result);
            } catch (err:any) {
                res.status(500).json({ message: `Error updating subject: ${err.message}` });
            }
    }
});

subjectRouter.get("/findAll", authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token))
            res.status(403).send({message: "Invalid token"});
        else{
            const subjects = await Subject.find({})
            .populate({
                path: 'sessions',
                populate: {
                    path: 'classroom',
                    populate: {
                        path: 'computers.student',
                        model: 'StudentEntry',
                        populate: {
                            path: 'student',
                            model: 'Student',
                            select: "-password"
                        }
                    }
                }
            })
            .exec();
            res.json(subjects);
        }
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.post("/filteredFind", authorizeToken, async (req: any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid token"});
        else{
            const query = req.body;
            const subject = await Subject.find(query)
            .populate({
                path: 'sessions',
                populate: {
                    path: 'classroom',
                    populate: {
                        path: 'computers.student',
                        model: 'StudentEntry',
                        populate: {
                            path: 'student',
                            model: 'Student',
                            select: "-password"
                        }
                    }
                }
            })
            .exec();
            res.json(subject);
        }
    } catch (err) {
        res.status(500).json( { message: "Could not find subjects"});
    }
});

subjectRouter.delete("/delete/:id", authorizeToken, async (req:any, res) => {
    try {
        if(!verifyToken(req.token)) 
            res.status(403).send({message: "Invalid token"});
        else {
            const subjectId = req.params.id;

        const subject = await Subject.findByIdAndDelete(subjectId);

        if (!subject) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Subject deleted successfully" });
        }        
    } catch (error) {
        console.error('Error deleting subject: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default subjectRouter;