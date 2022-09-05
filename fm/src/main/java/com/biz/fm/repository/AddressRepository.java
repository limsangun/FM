package com.biz.fm.repository;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.biz.fm.domain.entity.Address;

@Mapper
public interface AddressRepository {
	@Select("SELECT * FROM address")
	public List<Address> findAll();
	
	@Select("SELECT *, id as address_id FROM address WHERE id = #{id}")
	@Results(id = "AddressEntityMap", value = {
			@Result(property = "id", column = "address_id"),
			@Result(property = "postalCode", column = "postal_code"),
			@Result(property = "road", column = "road"),
			@Result(property = "jibun", column = "jibun"),
			@Result(property = "detail", column = "detail")
	})
	public Address findById(String id);
	
	@Insert("INSERT INTO address VALUES (#{id}, #{postalCode}, #{road}, #{jibun}, #{detail})")
	public int insert(Address address);
	
	@Update("UPDATE address SET postal_code = #{postalCode}, road = #{road}, jibun = #{jibun}, detail = #{detail} WHERE id = #{id}")
	public int update(Address address);
}
