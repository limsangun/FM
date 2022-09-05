package com.biz.fm.controller;

import java.util.List;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biz.fm.domain.dto.FileDataDto.FileDataListResonse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeListResonse;
import com.biz.fm.domain.dto.FranchiseeDto.Hours;
import com.biz.fm.domain.dto.MenuDto.MenuListResonse;
import com.biz.fm.service.OpenApiService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(tags = {"10. OpenAPI"})
@RestController
@RequestMapping("/open-api/v1/franchisee")
@RequiredArgsConstructor
@CrossOrigin
@Validated
public class OpenApiController {
	
	private final OpenApiService openApiService;
	
	@GetMapping
	@ApiOperation(value = "페이지로 가맹점 조회", notes = "페이지로 가맹점을 조회한다.")
	public ResponseEntity<FranchiseeListResonse> findAllByPageJson(@ApiParam(value = "페이지 번호", required = true) @Min(1) 
																	@RequestParam int page, 
																	@ApiParam(value = "한 페이지 결과 수", required = true) @Min(1) 
																	@RequestParam int rowsNum,
																	@ApiParam(value = "가맹점 명")
																	@RequestParam(required = false) String bsnsNm) throws NotFoundException{
		
		return ResponseEntity.ok(openApiService.findAllByPage(page, rowsNum, bsnsNm));
	}
	
//	@GetMapping("/{businessNumber}")
//	@ApiOperation(value = "가맹점 조회", notes = "사업자 번호로 가맹점을 조회한다.")
//	public ResponseEntity<FranchiseeResponse> findByBusinessNumber(@ApiParam(value = "사업자 번호( '-' 제외 )", required = true) @Size(min = 10, max = 10, message = "사업자 번호는 10 자리여야 합니다.")
//																	@PathVariable String businessNumber) throws NotFoundException{
//		return ResponseEntity.ok(openApiService.findByBusinessNumber(businessNumber));
//	}
	
	@GetMapping("/menus")
	@ApiOperation(value = "가맹점 메뉴 조회", notes = "사업자 번호를 통해 메뉴를 조회한다.")
	public ResponseEntity<MenuListResonse> findMenuAllByBusinessNumber(@ApiParam(value = "사업자 번호", required = true) @Size(min = 10, max = 10, message = "사업자 번호는 10 자리여야 합니다.")
																		   @RequestParam String bsnsNum) throws NotFoundException{
		return ResponseEntity.ok(openApiService.findMenuByBusinessNumber(bsnsNum));
	}
	
	@GetMapping("/images")
	@ApiOperation(value = "가맹점 이미지 조회", notes = "가맹점에 등록된 모든 이미지를 조회한다.")
	public ResponseEntity<FileDataListResonse> findImageByBusinessNumber(@ApiParam(value = "사업자 번호", required = true) @Size(min = 10, max = 10, message = "사업자 번호는 10 자리여야 합니다.")
																		  @RequestParam String bsnsNum) throws NotFoundException{
		return ResponseEntity.ok(openApiService.findImageAllByBusinessNumber(bsnsNum));
	}
	
	@GetMapping("/schedule")
	@ApiOperation(value = "가맹점 영업시간 조회", notes = "사업자 번호로 영업시간을 조회한다.")
	public ResponseEntity<Hours> findHoursByBusinessNumber(@ApiParam(value = "사업자 번호", required = true) 
															@Size(min = 10, max = 10, message = "사업자 번호는 10 자리여야 합니다.")
															@RequestParam String bsnsNum) throws JsonMappingException, JsonProcessingException, NotFoundException{
		return ResponseEntity.ok(openApiService.findHoursByBusinessNumber(bsnsNum));
	}
}
