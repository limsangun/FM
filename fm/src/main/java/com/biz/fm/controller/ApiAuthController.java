package com.biz.fm.controller;

import java.text.ParseException;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biz.fm.domain.dto.AppTokenDto.AppTokenPublish;
import com.biz.fm.domain.dto.AppTokenDto.NewAccessTokenPublish;
import com.biz.fm.service.ApiAuthService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(tags = {"8. Api Auth"})
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class ApiAuthController{
private final ApiAuthService apiAuthService;
	
    @PostMapping("/publish")
    @ApiOperation(value = "토큰 발급", notes = "앱 키를 통해서 토큰을 발급받는다.")
    public ResponseEntity<?> tokenIssue(
    		@ApiParam(value = "앱 키", required = true) @RequestBody AppTokenPublish appKey, ServletRequest request) throws NotFoundException, ParseException {
    	Map<String, String> accessToken = apiAuthService.requestToken(appKey, request);    	
        return ResponseEntity.ok(accessToken);
    }
    
    @PostMapping("/republish")
    @ApiOperation(value = "토큰 재발급", notes = "토큰을 재발급한다.")
    public ResponseEntity<?> tokenReissue(
    		@ApiParam(value = "토큰 재발급 정보", required = true) @RequestBody NewAccessTokenPublish newAccessToken, HttpServletRequest request) 
    				throws NotFoundException, ParseException {
    	
    	Map<String, String> accessToken = apiAuthService.newAccessToken(newAccessToken, request); 
    	return ResponseEntity.ok(accessToken);
    }
}
	
