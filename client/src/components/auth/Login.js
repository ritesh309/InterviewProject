import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classnames from 'classnames';
class Login extends Component {
    constructor () {
        super()
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
    }

    onChange = ( e ) => {
        this.setState( { [e.target.name]: e.target.value } )
    }

    onSubmit = ( e ) => {
        e.preventDefault()
        const User = {
            email: this.state.email,
            password: this.state.password,

        }
        axios.post( '/api/users/login', User ).then( ( response ) => {
            console.log( response )
            localStorage.setItem( 'usertoken', response.data )
            this.props.history.push( '/' )
        } ).catch( ( error ) => {
            console.log( error.response )
            this.setState( { errors: error.response.data } )
        } )

        console.log( User )

    }

    render() {
        const { errors } = this.state
        return (
            <div className="Login mt-5 mb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">

                            <h1 className="display-4 text-center">
                                Login
                            </h1>

                            <form onSubmit={this.onSubmit}>

                                <div className="form-group">
                                    <input type="email" className={classnames( "form-control form-control-lg mt-4", {
                                        "is-invalid": errors.email
                                    } )}
                                        placeholder="Email Address"
                                        name="email"
                                        value={this.state.email}

                                        onChange={this.onChange} />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>

                                    )}
                                </div>
                                <div className="form-group">
                                    <input type="password" className={classnames( "form-control form-control-lg mt-4", {
                                        "is-invalid": errors.password
                                    } )}
                                        placeholder="Password"
                                        name="password"
                                        value={this.state.password}

                                        onChange={this.onChange}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>

                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 ms-auto">

                                        <input type="submit" className="btn btn-primary btn-block mt-4" />
                                    </div>
                                    <div className="col-md-6">
                                        <Link to="/register" className="btn btn-outline-dark btn-block mt-4 mb-5">Register</Link>

                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login