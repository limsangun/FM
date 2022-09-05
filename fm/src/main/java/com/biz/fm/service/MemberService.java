package com.biz.fm.service;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.Size;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.stereotype.Service;
import com.biz.fm.domain.dto.FranchiseeDto.FranchiseeResponse;
import com.biz.fm.domain.dto.FranchiseeDto.SearchFranchiseeList;
import com.biz.fm.domain.dto.MemberDto.MemberResponse;
import com.biz.fm.domain.dto.MemberDto.MemberUpdate;
import com.biz.fm.domain.entity.Address;
import com.biz.fm.domain.entity.Application;
import com.biz.fm.domain.entity.Franchisee;
import com.biz.fm.domain.entity.Member;
import com.biz.fm.exception.custom.DeleteFailException;
import com.biz.fm.exception.custom.UpdateFailException;
import com.biz.fm.repository.AddressRepository;
import com.biz.fm.repository.ApplicationRepository;
import com.biz.fm.repository.FranchiseeRepository;
import com.biz.fm.repository.MemberRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	
	private final MemberRepository memberRepository;
	private final FranchiseeRepository franchiseeRepository;
	private final AddressRepository addressRepository;
	private final ApplicationRepository applicationRepository;
	
	public List<MemberResponse> getList() throws NotFoundException{
		List<Member> members = memberRepository.findAll();
		if(members.size() == 0) throw new NotFoundException(null);
		
		List<MemberResponse> memberReads = new ArrayList<>();
		for(Member member : members) {
			memberReads.add(member.toMemberRead());
		}
		return memberReads;
	}
	
	public MemberResponse getMemberById(String memberId) throws NotFoundException {
		Member member = memberRepository.findById(memberId);
		if(member == null) throw new NotFoundException(null);
		return member.toMemberRead();
	}
	
	public MemberResponse getMemberByEmail(String email) throws NotFoundException {
		Member member = memberRepository.findByEmail(email);
		if(member == null) throw new NotFoundException(null);
		return member.toMemberRead();
	}
	
	public SearchFranchiseeList findFranchiseeByMemberId(String memberId, int page, String order, String option, String query) throws NotFoundException, JsonMappingException, JsonProcessingException{
		int offset = (page - 1) * 5;
		
		List<Franchisee> franchisees = franchiseeRepository.findBySearchParam(memberId, offset, order, option, query);
		
		if(franchisees == null) throw new NotFoundException(null);
		
		int count = franchiseeRepository.findAllByMemberIdCount(memberId, query);
		
		List<FranchiseeResponse> franchiseeResponses = new ArrayList<>();
		for(Franchisee franchisee : franchisees) {
			franchiseeResponses.add(franchisee.toFranchiseeResponse());
		}
		
		SearchFranchiseeList searchFranchiseeList = new SearchFranchiseeList();
		searchFranchiseeList.setFranchisees(franchiseeResponses);
		searchFranchiseeList.setSearchCount(count);
		return searchFranchiseeList;
	}
	
	public List<FranchiseeResponse> findFranchiseeAllByMemberId(String memberId) throws NotFoundException {
		List<Franchisee> franchisees = franchiseeRepository.findAllByMemberId(memberId);
		
		if(franchisees == null) throw new NotFoundException(null);
		
		List<FranchiseeResponse> franchiseeResponses = new ArrayList<>();
		for(Franchisee franchisee : franchisees) {
			franchiseeResponses.add(franchisee.toFranchiseeResponse());
		}
		
		return franchiseeResponses;
	}
	
	public List<Application> findApplicationByMemberId(String memberId) throws NotFoundException {
		List<Application> apps = applicationRepository.findByMemberId(memberId);
		
		if(apps == null) throw new NotFoundException(null);
		
		return apps;
	}
	
	public MemberResponse update(String memberId, MemberUpdate memberUpdate) {
		Member oldMember = memberRepository.findById(memberId);
		if(oldMember == null) throw new UpdateFailException();
		
		
		if(memberUpdate.getAddress() != null) {
			Address address = addressRepository.findById(oldMember.getAddress().getId());
			address.patch(memberUpdate.getAddress());
			addressRepository.update(address);
		}
		
		memberUpdate.patch(oldMember);
		
		int result = memberRepository.update(memberId, memberUpdate);
		if(result > 0) {
			return memberRepository.findById(memberId).toMemberRead();
		}
		else throw new UpdateFailException();
	}

	public MemberResponse delete(String memberId) {
		Member member = memberRepository.findById(memberId);
		if(member == null) throw new DeleteFailException();
		
		int result = memberRepository.delete(memberId);
		if(result > 0) {
			return member.toMemberRead();
		}
		else throw new DeleteFailException();
		
		
//		String deleteEamil = member.getEmail() + "/DELETE";
//		member.setEmail(deleteEamil);
//		
//		int result = memberRepository.delete(memberId, deleteEamil);
//		if(result > 0) {
//			return member.toMemberRead();
//		}
//		else throw new DeleteFailException();
	}
}
