package com.biz.fm.utils;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.biz.fm.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

//스프림 시큐리티 컨텍스트 내에 존재하는 인증절차 중 인증과정이 실패하거나 인증헤더(Authorization)를 보내지 않게 되는 경우 
//401이라는 응답값을 던지는데 이를 처리해주는 인터페이스입니다. 401이 떨어질만한 에러가 발생한 경우 commerce() 메서드가 실행됩니다.
@Component
@RequiredArgsConstructor
public class AuthenticationEntryPointHandler implements AuthenticationEntryPoint {

	@Override
    public void commence(HttpServletRequest request, HttpServletResponse response
    		, org.springframework.security.core.AuthenticationException authException) 
    		throws IOException, ServletException {
		
        String exception = (String) request.getAttribute("exception");
        ErrorCode errorCode;
        
        /**
         * 토큰이 없는 경우 예외처리
         */
        if(exception == null) {
            errorCode = ErrorCode.FORBIDDEN_EXCEPTION;
            setResponse(response, errorCode);
            return;
        }
        
        /**
         * 권한이 없는 접근일 때 exception 처리
         */
        if(exception.equals("ForbiddenException")) {
            errorCode = ErrorCode.FORBIDDEN_EXCEPTION;
            setResponse(response, errorCode);
            return;
        }

        /**
         * JWT가 올바르게 구성되지 않았을 때
         */
        if(exception.equals("NotCorrectJwt")) {
            errorCode = ErrorCode.NOTCORRECT_JWT;
            setResponse(response, errorCode);
            return;
        }

        /**
         * 토큰이 만료된 경우 예외처리
         */
        if(exception.equals("ExpiredJwtException")) {
            errorCode = ErrorCode.EXPIRED_JWT_EXCEPTION;
            setResponse(response, errorCode);
            return;
        }
        
        /**
         * 예상하는 형식과 일치하지 않는 특정 형식이나 구성의 JWT일 때
         */
//        if(exception.equals("UnexpectedJwt")) {
//            errorCode = ErrorCode.UNEXPECTED_JWT;
//            setResponse(response, errorCode);
//            return;
//        }
        
        /**
         * 메소드가 잘못되었거나 부적합한 인수를 전달했음을 나타내기 위해
         */
        if(exception.equals("IllegalArgumentException")) {
            errorCode = ErrorCode.ILLEGAL_ARGUMENT_EXCEPTION;
            setResponse(response, errorCode);
            return;
        }
        
        /**
         * JWT의 기존 서명을 확인하지 못했을 때
         */
//        if(exception.equals("NoSignatureJwt")) {
//            errorCode = ErrorCode.NO_SIGNATURE_JWT;
//            setResponse(response, errorCode);
//            return;
//        }
    }

    private void setResponse(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("utf-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        JSONObject json = new JSONObject();
        json.put("status", errorCode.getStatus().toString().substring(0, 3));
        json.put("code", errorCode.getCode());
        json.put("message", errorCode.getMessage());
        response.getWriter().print(json);
    }
	
}
