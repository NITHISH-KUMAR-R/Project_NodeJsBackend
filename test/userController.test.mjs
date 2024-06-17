import { expect } from 'chai';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../app.js'; // Ensure your app is exported from app.mjs
import mongodb from '../Schema/userData.js';
import { userRegister, userLogin, allUserProfile, logout } from '../Controller/userAuthControllern';

describe( 'User Controller Tests', () => {
    beforeEach( async () => {
        await mongodb.deleteMany( {} );
    } );

    describe( 'POST /user/register', () => {
        it( 'should register a new user', async () => {
            const newUser={
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123'
            };

            const res=await request( app )
                .post( '/user/register' )
                .send( newUser )
                .expect( 200 );

            expect( res.text ).to.equal( 'Successfully Added to DB' );
        } );

        it( 'should return 500 Internal Server Error for invalid registration', async () => {
            const invalidUser={
                name: 'Jane Doe'
                // Missing email and password intentionally
            };

            const res=await request( app )
                .post( '/user/register' )
                .send( invalidUser )
                .expect( 500 );

            expect( res.text ).to.equal( 'Internal Server error' );
        } );
    } );

    describe( 'POST /user/login', () => {
        beforeEach( async () => {
            const salt=bcrypt.genSaltSync( 10 );
            const hash=bcrypt.hashSync( 'password123', salt );
            await mongodb.create( {
                username: 'John Doe',
                email: 'john.doe@example.com',
                password: hash
            } );
        } );

        it( 'should login an existing user', async () => {
            const loginCredentials={
                email: 'john.doe@example.com',
                password: 'password123'
            };

            const res=await request( app )
                .post( '/user/login' )
                .send( loginCredentials )
                .expect( 200 );

            expect( res.body.message ).to.equal( 'User Logged In Successfully' );
            expect( res.body.username ).to.equal( 'john.doe@example.com' );
        } );

        it( 'should return 401 Unauthorized for incorrect password', async () => {
            const invalidCredentials={
                email: 'john.doe@example.com',
                password: 'wrongpassword'
            };

            const res=await request( app )
                .post( '/user/login' )
                .send( invalidCredentials )
                .expect( 401 );

            expect( res.text ).to.equal( 'Invalid Password' );
        } );
    } );

    describe( 'GET /user/all', () => {
        beforeEach( async () => {
            await mongodb.create( [
                { username: 'User1', email: 'user1@example.com', password: bcrypt.hashSync( 'password1', 10 ) },
                { username: 'User2', email: 'user2@example.com', password: bcrypt.hashSync( 'password2', 10 ) }
            ] );
        } );

        it( 'should fetch all user profiles', async () => {
            const res=await request( app )
                .get( '/user/all' )
                .expect( 200 );

            expect( res.body.length ).to.equal( 2 );
        } );
    } );

    describe( 'GET /user/logout', () => {
        it( 'should logout the user successfully', async () => {
            const agent=request.agent( app );

            const loginCredentials={
                email: 'john.doe@example.com',
                password: 'password123'
            };

            await agent
                .post( '/user/login' )
                .send( loginCredentials )
                .expect( 200 );

            const res=await agent
                .get( '/user/logout' )
                .expect( 200 );

            expect( res.text ).to.equal( 'user Logout successfull' );
        } );
    } );
} );
