import { api } from 'src/boot/axios';
import type {
  Credentials
} from 'src/types/authorize';

export class AuthService{
  async login(credentials: Credentials){
    return await api.post('/login', credentials );
  }

  async getUser(){
    return await api.get('/user');
  }

  async logout(){
    return await api.get('/logout');
  }
}

export const authService = new AuthService();
