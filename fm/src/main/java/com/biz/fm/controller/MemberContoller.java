package com.biz.fm.controller;

import java.util.List;

import javax.validation.constraints.Size;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.dto.FranchiseeDto.SearchFranchiseeList;
import com.biz.fm.domain.dto.MemberDto.MemberResponse;
import com.biz.fm.domain.dto.MemberDto.MemberUpdate;
import com.biz.fm.domain.entity.Application;
import com.biz.fm.service.MemberService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;

@Api(tags = {"4. Member"})
@RestController
@RequestMapping("/api/v1/member")
@RequiredArgsConstructor
@CrossOrigin
public class MemberContoller {

	private final MemberService memberService;
	
	@GetMapping("/{memberId}")
	@ApiOperation(value = "유저 조회", notes = "유저 id를 통해 유저 조회한다.")
	public ResponseEntity<MemberResponse> get(@ApiParam(value = "유저 id", required = true) @Size(min = 32, max = 32, message = "memberID 는 32 자리여야 합니다.")
											   @PathVariable String memberId) throws NotFoundException{
		return ResponseEntity.ok(memberService.getMemberById(memberId));
	}
	
	@GetMapping("/{memberId}/application")
	@ApiOperation(value = "앱 리스트 조회", notes = "사용자 id로 앱을 조회한다.")
	public ResponseEntity<List<Application>> getAppByMemberId(@ApiParam(value = "유저 아이디", required = true) @Size(min = 32, max = 32, message = "memberID 는 32 자리여야 합니다.")
															   @PathVariable String memberId) throws NotFoundException{
		return ResponseEntity.ok(memberService.findApplicationByMemberId(memberId));
	}
	
	@GetMapping("/{memberId}/franchisee")
	@ApiOperation(value = "가맹점 조회", notes = "사용자 id로 가맹점을 조회한다.")
	public ResponseEntity<SearchFranchiseeList> getByMemberId(@ApiParam(value = "유저 아이디", required = true) @Size(min = 32, max = 32, message = "memberID 는 32 자리여야 합니다.") 
															   @PathVariable String memberId, 
															   @ApiParam(value = "페이지") @RequestParam(required = false, defaultValue = "1") int page,
															   @ApiParam(value = "정렬 컬럼", allowableValues = "business_number, name, tel") @RequestParam(required = false, defaultValue = "business_number") String order,
															   @ApiParam(value = "내림차순/오름차순", allowableValues = "ASC, DESC") @RequestParam(required = false, defaultValue = "ASC") String option,
															   @ApiParam(value = "검색 쿼리") @RequestParam(required = false, defaultValue = "") String query) throws NotFoundException, JsonMappingException, JsonProcessingException{
		return ResponseEntity.ok(memberService.findFranchiseeByMemberId(memberId, page, order, option, query));
	}
	
	@GetMapping("/{memberId}/franchisee/all")
	@ApiOperation(value = "가맹점 조회", notes = "사용자 id로 가맹점을 조회한다.")
	public ResponseEntity<List<FranchiseeResponse>> getByMemberId(@ApiParam(value = "유저 아이디", required = true) @Size(min = 32, max = 32, message = "memberID 는 32 자리여야 합니다.") 
															   @PathVariable String memberId) throws NotFoundException, JsonMappingException, JsonProcessingException{
		return ResponseEntity.ok(memberService.findFranchiseeAllByMemberId(memberId));
	}
	
	@PutMapping("/{memberId}")
	@ApiOperation(value = "유저 수정", notes = "유저 정보를 수정한다.")
	public ResponseEntity<MemberResponse> update(@ApiParam(value = "유저 아이디", required = true) @Size(min = 32, max = 32, message = "memberID 는 32 자리여야 합니다.") 
												  @PathVariable String memberId, 
												  @ApiParam(value = "유저 수정 정보", required = true) @Validated
												  @RequestBody MemberUpdate memberUpdate){
		return ResponseEntity.ok(memberService.update(memberId, memberUpdate)); 
	}
	
	@DeleteMapping("/{memberId}")
	@ApiOperation(value = "유저 삭제", notes = "유저를 삭제한다.")
	public ResponseEntity<MemberResponse> delete(@ApiParam(value = "유저 아이디", required = true) @Size(min = 32, max = 32, message = "memberID 는 32 자리여야 합니다.") 
												  @PathVariable String memberId){
		return ResponseEntity.ok(memberService.delete(memberId));
	}
}
