import axios from 'axios';
import { PetResponse } from '../models/PetModel';


const apiUrl = '/api/v1/barcode';

export const getPetInfo = async (code: string): Promise<PetResponse> => {
    try {
        const response = await axios.get<PetResponse>(`${apiUrl}/${code}`);
        return response.data;
    } catch (error) {
        // Handle error appropriately
        throw error;
    }
};