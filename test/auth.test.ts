import request from 'supertest';
import express from 'express';
import app from '../app'; // Import your Express app instance
import { Server } from 'socket.io';
import http from 'http';
import { SocketIOService } from '../websocketServer';
const time = new Date().getTime();
import { io as clientIO, Socket } from 'socket.io-client';

describe('Socket.io Events', () => {
  let io = SocketIOService.instance().getServer();

  it('should receive a socket message', (done) => {
    io.on('connection', (socket) => {
      socket.on('shareVideo', (message) => {
        expect(message).toBe('Hello, shareVideo!');

        // Finish the test once the message is received
        done();
      });
    });

    // Send a Socket.io message
    const socket = clientIO(`http://localhost:8080`);
    socket.on('connect', () => {
      socket.emit('shareVideo', 'Hello, shareVideo!');
    });
  });
});

describe('Authentication Endpoints', () => {
  describe('POST /signin', () => {
    it('should return a token and user information on successful authentication', async () => {
      const response = await request(app)
        .post('/auth/signin').set('Content-Type', 'application/json')
        .send({ email: '123456a@gmail.com', password: '1' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', '123456a@gmail.com');
      
    });

    it('should return an error when email or password is invalid', async () => {
      const response = await request(app)
        .post('/auth/signin').set('Content-Type', 'application/json')
        .send({ email: 'invalid@example.com', password: 'invalidpassword' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
      
    });

  });

  describe('POST /signup', () => {
    it('should return a success message on successful signup', async () => {
      
      const response = await request(app)
        .post('/auth/signup').set('Content-Type', 'application/json')
        .send({ name: 'Nguyen 1', email: `${time}@example.com`, password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("result",  {"success": "success"});
      
    });

    it('should return an error when user already exists', async () => {
      const response = await request(app)
        .post('/auth/signup').set('Content-Type', 'application/json')
        .send({ name: 'Nguyen 1', email: `${time}@example.com`, password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'User already exist');
      
    });
  });

});

describe('Videos', () => {
    describe('POST /share', () => {
      it('should share successfull video', async () => {
        const response = await request(app)
          .post('/auth/signin').set('Content-Type', 'application/json')
          .send({ email: '123456a@gmail.com', password: '1' });
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', '123456a@gmail.com');
        
  
        const resShare = await request(app)
          .post('/api/share').set('Content-Type', 'application/json')
          .set('authorization', `Bearer ${response.body.token}`)
          .send({ title: '123456a@gmail.com share', url: 'https://youtube.com?v=1111' });
        expect(resShare.status).toBe(200);
        expect(resShare.body).toHaveProperty('url', 'https://youtube.com?v=1111');
      });
  
      it('should return an error when title or url is invalid', async () => {
        const response = await request(app)
          .post('/auth/signin').set('Content-Type', 'application/json')
          .send({ email: '123456a@gmail.com', password: '1' });
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', '123456a@gmail.com');
  
        const resShare = await request(app)
          .post('/api/share').set('Content-Type', 'application/json')
          .set('authorization', `Bearer ${response.body.token}`)
          .send({ title: '123456a@gmail.com share', url: '' });
        expect(resShare.status).toBe(400);
        expect(resShare.body).toHaveProperty('error', 'Invalid data');
      });
  
    });
  
    describe('POST /videos', () => {
      it('should return list videos', async () => {
        
        const response = await request(app)
          .post('/api/videos').set('Content-Type', 'application/json')
          .send({offset: 0, size: 10 });
  
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("videos");
        
      });
    });
  
  });