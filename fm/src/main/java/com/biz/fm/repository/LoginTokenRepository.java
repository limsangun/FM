package com.biz.fm.repository;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.biz.fm.domain.entity.LoginToken;

@Mapper
public interface LoginTokenRepository {
	
	@Select("SELECT * FROM login_token WHERE refresh_token = #{refreshToken}")
	public LoginToken findByRefreshToken(String refreshToken);
	
	@Select("SELECT * FROM login_token WHERE access_token = #{accessToken}")
	public LoginToken findByAccessToken(String accessToken);
	
	@Select("SELECT * FROM login_token WHERE access_token = #{accessToken} AND refresh_token = #{refreshToken}")
	public LoginToken findByToken(String accessToken, String refreshToken);
	
	@Select("SELECT * FROM login_token WHERE member_id = #{memberId}")
	public LoginToken findByMemberId(String memberId);
	
	@Insert("INSERT INTO login_token VALUES (#{memberId}, #{accessToken}, #{refreshToken})")
	public int insert(LoginToken token);
	
	@Update("Update login_token SET access_token = #{accessToken}, refresh_token = #{refreshToken} WHERE member_id = #{memberId}")
	public int update(LoginToken token);
	
	@Delete("DELETE FROM login_token WHERE member_id = #{memberId}")
	public int delete(String memberId);
	
}
