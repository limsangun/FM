package com.biz.fm.exception.custom;

public class LogoutByStateLogin extends RuntimeException{
	public LogoutByStateLogin(){
		super();
	}
	
	public LogoutByStateLogin(String message) {
        super(message);
    }

}
