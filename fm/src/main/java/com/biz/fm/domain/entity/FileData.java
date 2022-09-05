package com.biz.fm.domain.entity;

import java.sql.Timestamp;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.biz.fm.domain.dto.FileDataDto.FileDataOpenResponse;
import com.biz.fm.domain.dto.FileDataDto.FileDataResponse;
import com.biz.fm.domain.dto.FileDataDto.UploadResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileData {
	private String id;
	private String path;
	private String size;
	private String name;
	private String type;
	private Timestamp createDate;
	private Timestamp deleteDate;
	
	public FileDataOpenResponse toFileDataOpenResponse() {
		String contextPath = ServletUriComponentsBuilder.fromCurrentContextPath().toUriString();
		return FileDataOpenResponse.builder()
				.downloadUrl(contextPath + path)
				.size(size)
				.name(name)
				.type(type)
				.createDate(createDate)
				.build();
	}
	
	public FileDataResponse toFileDataResponse() {
		return FileDataResponse.builder()
				.id(id)
				.path(path)
				.size(size)
				.name(name)
				.type(type)
				.createDate(createDate)
				.build();
	}
	
	public UploadResponse toUploadResponse() {
		return UploadResponse.builder()
				.id(id)
				.path(path)
				.size(size)
				.name(name)
				.type(type)
				.createDate(createDate)
				.build();
	}
}
