package com.biz.fm.domain.dto;

import java.sql.Timestamp;
import java.util.List;

import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.entity.FileData;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class FileDataDto {
	
	@Getter
	@Setter
	@Builder
	@JacksonXmlRootElement(localName = "images")
	public static class FileDataListResonse{
		
		@JacksonXmlProperty(localName = "image")
	    @JacksonXmlElementWrapper(useWrapping = false)
		private List<FileDataOpenResponse> images;
	}
	
	@Setter
	@Getter
	@Builder
	public static class FileDataOpenResponse {
		private String downloadUrl;
		private String size;
		private String name;
		private String type;
		@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
		private Timestamp createDate;
	}
	
	@Setter
	@Getter
	@Builder
	public static class FileDataResponse {
		private String id;
		private String path;
		private String size;
		private String name;
		private String type;
		@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
		private Timestamp createDate;
	}
	
	@Setter
	@Getter
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class UploadResponse {
		private String id;
		private String path;
		private String size;
		private String name;
		private String type;
		@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
		private Timestamp createDate;
	}
}
