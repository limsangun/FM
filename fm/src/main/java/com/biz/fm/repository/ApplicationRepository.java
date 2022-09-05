package com.biz.fm.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.biz.fm.domain.dto.ApplicationDto.AppUpdate;
import com.biz.fm.domain.entity.Application;

@Mapper
public interface ApplicationRepository {
	
	@Select("SELECT * FROM application WHERE member_id = #{memberId}")
	public List<Application> findByIdList(String memberId);
	
	@Select("SELECT * FROM application WHERE id = #{id}")
	public Application findById(String id);

	@Select("SELECT * FROM application WHERE name = #{name}")
	public Application findByName(String name);
	
	@Select("SELECT * FROM application WHERE api_key = #{Key}")
	public Application findByKey(String Key);
	
	@Select("SELECT * FROM application a LEFT JOIN member m ON a.member_id = m.id WHERE member_id = #{memberId}")
	public List<Application> findByMemberId(String memberId);

	@Insert("INSERT INTO application VALUES "
			+ "(#{id}, #{name}, #{apiKey}, #{memberId})")
	public int insert(Application appIn);
	
	@Update("UPDATE application SET name = #{name} WHERE id = #{appId}")
	public int nameUpdate(AppUpdate updateName);
	
	@Update("UPDATE application SET api_key = #{key} WHERE id = #{appId}")
	public int keyUpdate(AppUpdate updateInfo);

	@Delete("DELETE FROM application WHERE id = #{id}")
	public int delete(String id);

}
