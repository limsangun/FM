package com.biz.fm.controller;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biz.fm.domain.dto.ApplicationDto.AppCreate;
import com.biz.fm.domain.dto.ApplicationDto.AppDelete;
import com.biz.fm.domain.dto.ApplicationDto.AppUpdateKey;
import com.biz.fm.domain.dto.ApplicationDto.AppUpdateName;
import com.biz.fm.service.ApplicationService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(tags = {"7. App"})
@RestController
@RequestMapping("/api/v1/application")
@RequiredArgsConstructor
@CrossOrigin
public class AppController {
	
	private final ApplicationService appService;
	
	@GetMapping("/one/{appId}")
	@ApiOperation(value = "앱 단일 조회", notes = "App 아이디를 통해서 조회한다.")
	public ResponseEntity<?> selectOne(@ApiParam(value = "앱 조회 정보", required = true) @PathVariable String appId) throws NotFoundException{
		return ResponseEntity.ok(appService.getAppOne(appId));
	}
	
	@PostMapping
	@ApiOperation(value = "앱 생성", notes = "앱을 생성한다.")
	public ResponseEntity<?> insert(@ApiParam(value = "앱 생성 정보", required = true) @RequestBody AppCreate createAppInfo){
		return ResponseEntity.ok(appService.insert(createAppInfo));
	}
	
	@PutMapping("/name")
	@ApiOperation(value = "앱 이름 수정", notes = "앱을 이름을 수정한다.")
	public ResponseEntity<?> nameUpdate(@ApiParam(value = "앱 이름 수정 정보", required = true) @RequestBody AppUpdateName appUpdateName) throws NotFoundException{
		return ResponseEntity.ok(appService.nameUpdate(appUpdateName));
	}
	
	@PutMapping("/key")
	@ApiOperation(value = "앱 키 재발급", notes = "앱 아이디를 통해 앱 키를 재발급 받는다.")
	public ResponseEntity<?> keyUpdate(@ApiParam(value = "앱 키 수정 정보", required = true) @RequestBody AppUpdateKey appUpdateKey){
		return ResponseEntity.ok(appService.keyUpdate(appUpdateKey));
	}
	
	@DeleteMapping
	@ApiOperation(value = "앱 삭제", notes = "앱을 삭제한다.")
	public ResponseEntity<?> delete(@ApiParam(value = "앱 삭제 정보", required = true) @RequestBody AppDelete appDelete){
		return ResponseEntity.ok(appService.delete(appDelete));
	} 
	
}
