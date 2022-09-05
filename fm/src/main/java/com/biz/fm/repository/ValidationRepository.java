package com.biz.fm.repository;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.biz.fm.domain.dto.ApplicationDto.AppUpdate;
import com.biz.fm.domain.entity.Validation;

@Mapper
public interface ValidationRepository {
	
	@Select("SELECT * FROM validation WHERE email = #{email}")
	public Validation findByEmail(String email);
	
	@Select("SELECT * FROM validation WHERE code = #{code}")
	public Validation findByCode(String code);
	
	@Insert("INSERT INTO validation VALUES (#{email}, #{code}, now()+300)")
	public int insert(Validation emailPasswordValidation);
	
	@Update("UPDATE validation SET code = #{code}, create_date_expiration = now()+300 WHERE email = #{email}")
	public int update(Validation validation);
	
	@Delete("DELETE FROM validation WHERE email = #{email}")
	public int delete(String email);

}
