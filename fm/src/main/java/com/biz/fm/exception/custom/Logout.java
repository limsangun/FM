package com.biz.fm.exception.custom;

public class Logout extends RuntimeException{
	public Logout(){
		super();
	}
	
	public Logout(String message) {
        super(message);
    }

}
