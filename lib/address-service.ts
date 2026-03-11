import { apiClient } from "./api-client";

export interface Address {
    id: number;
    direccion: string;
}

export const addressService = {
    async getAddresses(): Promise<Address[]> {
        const response = await apiClient.get<Address[]>(`/clientes/me/direcciones`);
        return response.data;
    },
    async addAddress(direccion: string): Promise<Address> {
        const response = await apiClient.post<Address>(`/clientes/me/direcciones`, { direccion });
        return response.data;
    },
    async removeAddress(direccionId: number): Promise<void> {
        await apiClient.delete(`/clientes/me/direcciones/${direccionId}`);
    }
};
