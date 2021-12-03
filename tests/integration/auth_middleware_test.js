const request = require('supertest');
const {User} = require('./../../app/Models/UserModel');

describe('/api/v1/endpoint', () => {
    beforeEach(() => { server = require('../../server.js'); });
    
    afterEach(async () => { 
        server.close();
        //Do clean up if values returned in response is not needed (if its an extra value and causing test case to fail)
        await ModelName.remove({});
    });

    const exec = async () => {
        return await request(server)
        .post('/api/v1/endpoint')
        .set('x-auth-token', token)
        .send({ name: 'some name' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if token is not provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});
