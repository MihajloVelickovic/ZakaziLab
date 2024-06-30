import mongoose from "mongoose";

export interface IRegistrationRequest{
    token: string
};

const RegistrationRequestSchema = new mongoose.Schema<IRegistrationRequest>({
    token: {
        type: String,
        unique: true,
        required: true
    }
});

const RegistrationRequest = mongoose.model<IRegistrationRequest>("RegistrationRequest", RegistrationRequestSchema);

export default RegistrationRequest;