package com.biz.fm.utils;

import org.springframework.security.core.GrantedAuthority;

public class GuestAuthority implements GrantedAuthority{

	private String guestRole = "ROLE_GUEST";
	
	@Override
	public String getAuthority() {
		return guestRole;
	}

}
