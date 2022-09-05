package com.biz.fm.domain.entity;

import com.biz.fm.domain.dto.ApplicationDto.AppUpdate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Application {
	
	private String id;
	private String name;
	private String apiKey;
	private String memberId;
	
	
	public AppUpdate toAppUpdate() {
		return AppUpdate.builder()
				.appId(id)
				.name(name)
				.key(apiKey)
				.build();
	}

}
