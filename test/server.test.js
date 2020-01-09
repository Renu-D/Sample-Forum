/*
before(): Runs before all tests in the given block
beforeEach(): Runs before each test in the given block
after(): Runs after all tests in the given block
afterEach(): Runs after each test in the given block
*/


//let axios = require('axios');
//let expect = require('chai').expect;
//let request = require('supertest');
//let usercontroller = require('../users/controller');
//let userService = require('../users/service');
//let controllerDB = require('../controllers/db');

//let config = require('../config/config.json');
//let mongoose = require('mongoose');
//let superagent = require('superagent');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let {expect} = chai;


chai.use(chaiHttp);

//checking the mocha
describe('Server!', () => {
    let token = '';
    it('Welcomes user to the api', (done) => {
        chai.request(server)
            .get('/')
            .end((err,res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals("success");
                expect(res.body.message).to.equals("Welcome To Testing API");
                done();
            });
    });
    //Test the /post route
    it('/login with correct credentials', async () => {
        let user = {
            username:"Surya",
            password:"Surya1234"
        }
        const response =
            await chai.request(server)
                .post('/api/users/login')
                .set('Content-Type', 'application/json') //no need
                .send(user);

        //console.log(response);
        token = response.body;
        //console.log(token);
        expect(response.statusCode).to.equal(200);
        expect(response).to.contain.property('text');
        //console.log(token);
    });

    //Test login for negative cases
    /*it('/login with invalid credentials', async () => {
        const user = {
            username:"Surya",
            password:"Surya"
        }
        const response = 
            await chai.request(server)
                .post('/api/users/login')
                .set('Content-Type','application/json')
                .send(user);
        //console.log(response);
        expect(response.statusCode).to.equal(401);
        expect(response.error.status).to.equal(401);
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Username or password is incorrect');
    });*/

    //Test /get method for profile
    it('/current route to get profile', async () => {
        console.log(token);
        const response =
            await chai.request(server)
                .get('/api/users/current')
                .set('Authorization','Bearer '+token);
        console.log(response);

    })
});

//Test the /get route
/*describe('/get user not authenticated bcause of without authentication', () => {
    it('it should get message as "User not authenticated"', (done) => {
        chai.request(server)
            .get('/api/users')
            .end((err,res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });
});*/

//Test the /post route
/*describe('/post register', function() {
    it('it should not register with same username by giving status 400 bad request', function(done) {
        let user = {
            firstName:"Rakesh",
            lastName:"D",
            username:"Rakesh",
            password:"Rakesh1234"
        }
        const response = chai.request(server)
            .post('/api/users/register')
            .set('Content-Type', 'application/json')
            .send(user)
            .end(function(err,res) {
                res.body.should.be.a('object');
                done();
            })
    });
});*/

/*
// toBeLessThan
it('should be under 1600', () => {
    const load1 = 800;
    const load2 = 700;
    expect(load1 + load2).to.lessThan(1600);
});

it('should be under or equal 1600', () => {
    const load1 = 800;
    const load2 = 800;
    expect(load1 + load2).to.lte(1600);
});

//toBeGreaterThan
it('should be greater 1600', () => {
    const load1 = 800;
    const load2 = 900;
    expect(load1 + load2).to.gte(1600);
});

//Regex
it('There is no I in team', () => {
    expect('team').not.to.match(/I/i);
});

//Arrays
it('Theri should be in usernames', () => {
    const usernames = ['john','jack','Theri','chan'];
    expect(usernames).to.contain('Theri');
});

//working with async data
it('login checking...', (done) => {
    request(app).get('http://localhost:4000/api/users/login',"abc")
    .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('text');
        done();
    })
    .catch((err) => done(err));
});
*/