package com.biz.fm.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class LoginTokenDto {

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class NewAccessToken{
		private String AccessToken;
		private String RefreshToken;
	}
	
}
