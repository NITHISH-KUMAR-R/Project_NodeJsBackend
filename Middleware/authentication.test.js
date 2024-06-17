const { mockRequest, mockResponse }=require( 'jest-mock-express' );
const { verifySession }=require( './authentication' ); // Assuming authentication.js is in the same directory
const mongoDb=require( '../Schema/userData' );

jest.mock( '../Schema/userData' );

describe( 'verifySession middleware', () => {
    it( 'should call next middleware if valid session exists', async () => {
        const req=mockRequest( {
            session: {
                userSession: {
                    Userid: 'validUserId'
                }
            }
        } );
        const res=mockResponse();
        const next=jest.fn();

        mongoDb.findById.mockResolvedValueOnce( { _id: 'validUserId' } );

        await verifySession( req, res, next );

        expect( next ).toHaveBeenCalled();
    } );

    it( 'should return 401 if no session exists', async () => {
        const req=mockRequest();
        const res=mockResponse();
        const next=jest.fn();

        await verifySession( req, res, next );

        expect( res.status ).toHaveBeenCalledWith( 401 );
        expect( res.send ).toHaveBeenCalledWith( 'Please login, no session exists' );
    } );

    it( 'should return 401 if no session user ID exists', async () => {
        const req=mockRequest( { session: { userSession: {} } } );
        const res=mockResponse();
        const next=jest.fn();

        await verifySession( req, res, next );

        expect( res.status ).toHaveBeenCalledWith( 401 );
        expect( res.send ).toHaveBeenCalledWith( 'No session userId found in session cookie menans cookies cleared from postman' );
    } );

    it( 'should return 400 if user not found for session ID', async () => {
        const req=mockRequest( { session: { userSession: { Userid: 'invalidUserId' } } } );
        const res=mockResponse();
        const next=jest.fn();

        mongoDb.findById.mockResolvedValueOnce( null );

        await verifySession( req, res, next );

        expect( res.status ).toHaveBeenCalledWith( 400 );
        expect( res.send ).toHaveBeenCalledWith( 'User not found for this session id' );
    } );

    it( 'should return 500 if an internal server error occurs', async () => {
        const req=mockRequest( {
            session: {
                userSession: {
                    Userid: 'validUserId'
                }
            }
        } );
        const res=mockResponse();
        const next=jest.fn();

        mongoDb.findById.mockRejectedValueOnce( new Error( 'Internal server error' ) );

        await verifySession( req, res, next );

        expect( res.status ).toHaveBeenCalledWith( 500 );
        expect( res.send ).toHaveBeenCalledWith( 'Internal session server error' );
    } );
} );
