package com.biz.fm.repository;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.One;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.biz.fm.domain.dto.MemberDto.MemberUp;
import com.biz.fm.domain.dto.MemberDto.MemberUpdate;
import com.biz.fm.domain.entity.Member;

@Mapper
public interface MemberRepository {
	@Select("SELECT * FROM member m JOIN address a ON m.address_id = a.id WHERE delete_date is null")
	@ResultMap("MemberEntityMap")
	public List<Member> findAll();
	
	@Select("SELECT *, m.id as owner_id, m.name as member_name FROM member m JOIN address a ON m.address_id = a.id WHERE m.id = #{id} AND delete_date is null")
	@Results(id = "MemberEntityMap", value = {
			@Result(property = "id", column = "owner_id"),
			@Result(property = "name", column = "member_name"),
			@Result(property = "email", column = "email"),
			@Result(property = "password", column = "password"),
			@Result(property = "phoneNumber", column = "phone_number"),
			@Result(property = "birth", column = "birth"),
			@Result(property = "role", column = "role"),
			@Result(property = "createDate", column = "create_date"),
			@Result(property = "deleteDate", column = "delete_date"),
			@Result(property = "address", column = "address_id", one = @One(resultMap = "com.biz.fm.repository.AddressRepository.AddressEntityMap"))
		})
	public Member findById(String Id);
	
	@Select("SELECT * FROM member m JOIN address a ON m.address_id = a.id WHERE email = #{email} AND delete_date is null")
	public Member findByEmail(String email);
	
//	@Select("SELECT delete_date FROM member WHERE email = #{email}")
//	public Timestamp findByEmailForDeleteDate(String email);
	
	@Select("SELECT * FROM member WHERE email = #{email}")
	public Member findByEmailForValidation(String email);
	
	@Select("SELECT * FROM member m JOIN address a ON m.address_id = a.id WHERE password = #{password} AND delete_date is null")
	@ResultMap("MemberEntityMap")
	public Member findByPassword(String password);

	@Insert("INSERT INTO member VALUES "
			+ "(#{id}, #{name}, #{email}, #{password}, #{phoneNumber}, #{birth}, #{role}, #{addressId}, now(), null)")
	public int insert(MemberUp member);
	
	@Update("UPDATE member SET phone_number = #{member.phoneNumber} "
			+ "WHERE id = #{id}")
	public int update(@Param("id") String id, @Param("member") MemberUpdate member);
	
	@Update("UPDATE member SET password = #{password} WHERE id = #{id}")
	public int updatePassword(String id, String password);
	
	@Update("UPDATE member SET role = #{role} WHERE id = #{id}")
	public int updateRole(String id, String role);

	@Delete("DELETE FROM member WHERE id = #{id}")
	public int delete(String id);
	
}
