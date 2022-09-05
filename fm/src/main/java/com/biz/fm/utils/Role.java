package com.biz.fm.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Role {
	ROLE_GUEST("ROLE_GUEST"),
	ROLE_USER("ROLE_USER"),
	ROLE_DEVELOPER("ROLE_DEVELOPER");

    private String value;
}
