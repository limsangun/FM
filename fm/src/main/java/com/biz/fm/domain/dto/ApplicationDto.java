package com.biz.fm.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class ApplicationDto {

	@Getter
	@Setter
	public static class AppCreate{
		private String name;
		private String email;
	}
	
	@Getter
	@Setter
	public static class AppUpdateName{
		private String appId;
		private String currentName;
		private String newName;
	}
	
	@Getter
	@Setter
	public static class AppUpdateKey{
		private String appId;
	}
	
	@Getter
	@Setter
	@Builder
	public static class AppUpdate{
		private String appId;
		private String name;
		private String key;
		
	}
	
	@Getter
	@Setter
	public static class AppDelete{
		private String appId;
	}
	
}
