package com.biz.fm.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import com.biz.fm.utils.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

//jwt가 유효한 토큰인지 인증하기 위한 필터
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends GenericFilterBean {

	private final JwtTokenProvider jwtTokenProvider;
	
	//doFilter() 메서드는 JWT 토큰의 인증 정보를 현재 실행중인 SecurityContext에 저장하는 역할을 수행합니다.
	//request의 header에서 토큰을 가져오고 유효성 체크후 해당 토큰이 유효하다면 SecurityContext애 인증정보를 저장합니다.
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
			throws IOException, ServletException {

		// 헤더에서 JWT 를 받아옵니다.
        String accessToken = jwtTokenProvider.resolveToken((HttpServletRequest) request);
        
        // 유효한 토큰인지 확인합니다.
        if (accessToken != null && jwtTokenProvider.validateToken(request, accessToken)) {
        	
            // 토큰이 유효하면 토큰으로부터 유저 정보를 받아옵니다.
            Authentication authentication = jwtTokenProvider.getAuthentication(accessToken);
            if(authentication == null) request.setAttribute("exception", "ForbiddenException");
 
            // SecurityContext 에 Authentication 객체를 저장합니다.
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);

	}

}