package com.biz.fm.domain.dto;

import java.sql.Timestamp;
import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

import com.biz.fm.domain.dto.FileDataDto.FileDataResponse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.entity.FileData;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;

import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class MenuDto {
	
	@Getter
	@Setter
	@Builder
	@JacksonXmlRootElement(localName = "menus")
	public static class MenuListResonse{
		
		@JacksonXmlProperty(localName = "menu")
	    @JacksonXmlElementWrapper(useWrapping = false)
		private List<MenuOpenApiResponse> menus;
	}
	
	@Getter
	@Setter
	@Builder
	@JacksonXmlRootElement(localName = "menu")
	public static class MenuOpenApiResponse{
		private String name;
		private Object image;
		private String description; 
		private Integer price;
		@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
		private Timestamp createDate;
	}
	
	@Getter
	@Setter
	public static class MenuResponse{
		private String id;
		private String name;
		private Object image;
		private String description; 
		private Integer price;
		@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
		private Timestamp createDate;
	}
	
	@Getter
	@Setter
	public static class MenuUpdate{
		@ApiModelProperty(example = "메뉴 이름")
		private String name;
		@ApiModelProperty(example = "메뉴 소개")
		private String description;
		@ApiModelProperty(example = "메뉴 가격")
		private Integer price;
		@ApiModelProperty(example = "메뉴 이미지 아이디")
		private String imageId;
	}
	
	@Getter
	@Setter
	public static class MenuCreate{
		@JsonProperty(access = Access.READ_ONLY)
		private String id;
		
		@NotBlank
		@ApiModelProperty(example = "메뉴 이름")
		private String name;
		
		
		@ApiModelProperty(example = "메뉴 소개")
		private String description;
		
		@Min(0)
		private Integer price;
		
		@ApiModelProperty(example = "이미지 id")
		private String imageId;
	}
	
	
}
 