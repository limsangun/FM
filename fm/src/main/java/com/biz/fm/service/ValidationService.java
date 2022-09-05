package com.biz.fm.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;

import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.biz.fm.domain.dto.EmailPasswordValicationDto.SendMail;
import com.biz.fm.domain.dto.EmailPasswordValicationDto.UpdatePassword;
import com.biz.fm.domain.dto.MemberDto.MemberResponse;
import com.biz.fm.repository.MemberRepository;
import com.biz.fm.repository.ValidationRepository;

import lombok.RequiredArgsConstructor;

import com.biz.fm.domain.entity.Member;
import com.biz.fm.domain.entity.Validation;
import com.biz.fm.exception.custom.DeleteFailException;
import com.biz.fm.exception.custom.InsertFailException;
import com.biz.fm.exception.custom.InvalidEmailException;
import com.biz.fm.exception.custom.InvalidPasswordException;
import com.biz.fm.exception.custom.UpdateFailException;

@Service
@RequiredArgsConstructor
public class ValidationService {

	private final JavaMailSender mailSender;
	private final ValidationRepository validationRepository;
	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;

	// 회원가입 시 이메일 인증
	public boolean sendToEmailForSignUp(SendMail sendMail) throws Exception {
		Member checkResult = memberRepository.findByEmailForValidation(sendMail.getEmail());
		if (checkResult != null) throw new InvalidEmailException();
		
		boolean result = checkVaulidation(sendMail.getEmail());
		return result;
	}

	// 비밀번호 찾을 시 이메일 인증
	public boolean sendToEmailForPassword(SendMail sendMail) throws Exception {
		Member checkResult = memberRepository.findByEmailForValidation(sendMail.getEmail());
		if (checkResult == null) throw new NotFoundException("등록된 이메일이 존재하지 않습니다.");
			
		boolean result = checkVaulidation(sendMail.getEmail());
		return result;
	}

	// 유효한 정보인지 확인
	public boolean checkInfoIsValid(String email, String password) {
		// 아이디 중복 확인
		Member member = memberRepository.findByEmail(email);
		if (member == null)
			throw new InvalidEmailException();

		// 패스워드를 확인.
		if (!passwordEncoder.matches(password, member.getPassword())) throw new InvalidPasswordException();

		return true;
	}

	// 비밀번호 변경
	public MemberResponse changePassword(UpdatePassword updatePassword) throws NotFoundException {
		
		boolean checkCode = this.checkCode(updatePassword.getEmail(), updatePassword.getCode());
		
		if(checkCode) {	
			updatePassword.setNewPassword(passwordEncoder.encode(updatePassword.getNewPassword()));
			Member member = memberRepository.findByEmail(updatePassword.getEmail());			
			
			int deleteValidationResult = validationRepository.delete(updatePassword.getEmail());
			if(deleteValidationResult > 0) {
				int updatePasswordResult = memberRepository.updatePassword(member.getId(), updatePassword.getNewPassword());
				if (updatePasswordResult > 0) {
					Member memberResult = memberRepository.findByEmail(updatePassword.getEmail());
					MemberResponse memberResponseResult = memberResult.toMemberRead();
					return memberResponseResult;
				}
				throw new UpdateFailException();
			}
			throw new DeleteFailException();
		}
		return null; // this.checkCode() 에서 모든 validation 처리를 해주기 때문에, null 을 리턴한다. 
	}
	
	public boolean checkVaulidation(String email) throws Exception {
		// 인증번호
		String code = createCode(); 
		
		Validation calculation = Validation
									.builder()
									.email(email)
									.code(code)
									.build();
		
		Validation validationResult = validationRepository.findByEmail(email);
		if(validationResult == null) {
			int insertResult = validationRepository.insert(calculation);
			if (insertResult > 0) {
				// 제한시간
				Date expiration = validationRepository.findByEmail(email).getCreateDateExpiration();	
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm");
				String dataFormatExpiration = simpleDateFormat.format(expiration);
				
				this.sendMail(email, code, dataFormatExpiration);
				return true;
			}
				
		} else if (validationResult != null) {
			int updateResult = validationRepository.update(calculation);
			if (updateResult > 0) {
				// 제한시간
				Date expiration = validationRepository.findByEmail(email).getCreateDateExpiration();	
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm");
				String dataFormatExpiration = simpleDateFormat.format(expiration);
				
				this.sendMail(email, code, dataFormatExpiration); 
				return true;
			}
		}
		
		throw new InsertFailException();
	}

	public boolean checkCode(String email, String code) throws NotFoundException {
		Validation findResultByEmail = validationRepository.findByEmail(email);
		Validation findResultByCode = validationRepository.findByCode(code);
		
		if(findResultByEmail == null) throw new NotFoundException("인증 이메일 정보가 존재하지 않습니다. 인증 코드를 재발급 받아주세요.");
		if(findResultByCode == null) throw new NotFoundException("인증 코드가 일치하지 않습니다.");

		Timestamp createDateExpiration = findResultByEmail.getCreateDateExpiration();
		boolean expirationCheckResult = expirationCheck(createDateExpiration);
		
		if(expirationCheckResult) return true;
		else throw new NotFoundException("3분 제한시간을 초과했습니다. 새롭게 인증코드를 발급 받으세요.");
	}
	
	public static String createCode() {
		StringBuffer key = new StringBuffer();
		Random rnd = new Random();

		for (int i = 0; i < 6; i++) { // 인증코드 6자리
			key.append((rnd.nextInt(10)));
		}
		return key.toString();
	}
	
	public boolean expirationCheck(Timestamp expirationTime) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss.SSS");
		Date currentTime = new Date();
		currentTime.setTime(System.currentTimeMillis());
		String simpleDateFormatCurrentTime = simpleDateFormat.format(currentTime);
		Timestamp timeStampCurrentTime = Timestamp.valueOf(simpleDateFormatCurrentTime);
		
		boolean result = timeStampCurrentTime.before(expirationTime);
		return result;
	}

	public void sendMail(String email, String code, String time) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		message.addRecipients(RecipientType.TO, email); // 보내는 대상
		message.setSubject("FM 회원정보 인증번호 : " + code); // 제목
		
		StringBuffer sb = new StringBuffer();
        sb.append("<html>");
        sb.append("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>");
        sb.append("<body>");
        sb.append("  <table align=\"center\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#efeff0\" style=\"border-collapse:collapse\">\r\n"
                + "    <tbody>\r\n"
                + "  <tr>\r\n"
                + "    <td width=\"100%\" height=\"100\"/>\r\n"
                + "  </tr>\r\n"
                + "      <tr>\r\n"
                + "        <td width=\"3%\"> </td>\r\n"
                + "        <td width=\"94%\"> </td>\r\n"
                + "        <td width=\"3%\"> </td>\r\n"
                + "      </tr>\r\n"
                + "      <tr>\r\n"
                + "          <td><table align=\"center\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\" style=\"max-width:900px;margin:0 auto\">\r\n"
                + "          <tbody>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"100%\" height=\"25\" colspan=\"3\" bgcolor=\"#2528f5\"/>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"3%\" height=\"25\" bgcolor=\"#2528f5\"> </td>\r\n"
                + "              <td width=\"88%\" height=\"25\" bgcolor=\"#2528f5\">\r\n"
                + "                <img src=\"https://www.bizplaypr.co.kr/bizv3/img/bg/logoW.png\" width=\"100\" height=\"30\" alt=\"Messengernara 계정\" border=\"0\" style=\"display:block\" loading=\"lazy\">\r\n"
                + "              </td>\r\n"
                + "              <td width=\"3%\" height=\"25\" bgcolor=\"#2528f5\"> </td>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"100%\" height=\"25\" colspan=\"3\" bgcolor=\"#2528f5\"/>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"100%\" height=\"35\" colspan=\"3\"/>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "              <td width=\"88%\" style=\"font-size:18px;line-height:22px;font-family:Apple SD Gothic Neo,sans-serif,'맑은고딕',Malgun Gothic,'굴림',gulim;letter-spacing:-1px;font-weight:bold;color:#1e1e1e\">\r\n"
                + "                회원정보 인증을 위한 인증번호입니다.\r\n"
                + "              </td>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"100%\" height=\"25\" colspan=\"3\"/>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "              <td width=\"88%\" style=\"font-size:14px;line-height:22px;font-family:Apple SD Gothic Neo,sans-serif,'맑은고딕',Malgun Gothic,'굴림',gulim;letter-spacing:-1px;color:#1e1e1e\">\r\n"
                + "                아래의 인증번호를 입력하여 인증을 진행하실 수 있습니다.\r\n"
                + "              </td>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"100%\" height=\"18\" colspan=\"3\"/>\r\n"
                + "            </tr>\r\n"
                + "            <tr>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "              <td width=\"88%\">\r\n"
                + "                <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"line-height:22px;font-family:Apple SD Gothic Neo,sans-serif,'맑은고딕',Malgun Gothic,'굴림',gulim;letter-spacing:-1px;color:#1e1e1e\">\r\n"
                + "                  <tbody>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"100%\" height=\"1\" colspan=\"5\" bgcolor=\"#bebebe\"/>\r\n"
                + "                    </tr>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"100%\" height=\"25\" colspan=\"5\"/>\r\n"
                + "                    </tr>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"3%\"/>\r\n"
                + "                      <td width=\"3%\"/>\r\n"
                + "                    </tr>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"3%\"/>\r\n"
                + "                      <th align=\"left\" colspan=\"1\" rowspan=\"1\" valign=\"top\" width=\"35%\" style=\"font-size:14px;font-weight:normal\">\r\n"
                + "                        비밀번호 요청 이메일\r\n"
                + "                      </th>\r\n"
                + "                      <td width=\"2%\"/>\r\n"
                + "                      <td valign=\"top\" width=\"65%\" style=\"font-size:14px;font-weight:bold;word-break:break-all\">\r\n"
                +                         email + "\r\n"
                + "                      </td>\r\n"
                + "                      <td width=\"3%\"/>\r\n"
                + "                    </tr>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"100%\" height=\"8\" colspan=\"5\"/>\r\n"
                + "                    </tr>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"3%\"/>\r\n"
                + "                      <th align=\"left\" colspan=\"1\" rowspan=\"1\" valign=\"top\" width=\"35%\" style=\"font-size:14px;font-weight:normal\">\r\n"
                + "                        인증번호\r\n"
                + "                      </th>\r\n"
                + "                      <td width=\"2%\"/>\r\n"
                + "                      <td valign=\"top\" width=\"65%\" style=\"font-size:14px;font-weight:bold;word-break:break-all\">\r\n"
                +                         code + "\r\n"
                + "                      </td>\r\n"
                + "                      <td width=\"3%\"/>\r\n"
                + "                    </tr>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"100%\" height=\"8\" colspan=\"5\"/>\r\n"
                + "                    </tr>\r\n"
                + "                    <tr>\r\n"
                + "                      <td width=\"3%\"/>\r\n"
                + "                      <th align=\"left\" colspan=\"1\" rowspan=\"1\" valign=\"top\" width=\"35%\" style=\"font-size:14px;font-weight:normal\">\r\n"
                + "                        제한시간\r\n"
                + "                      </th>\r\n"
                + "                      <td width=\"2%\"/>\r\n"
                + "                    <td valign=\"top\" width=\"65%\" style=\"font-size:14px;font-weight:bold;word-break:break-all\">\r\n"
                +                         time + "\r\n"
                + "                    </td>\r\n"
                + "                    <td width=\"3%\"/>\r\n"
                + "                  </tr>\r\n"
                + "                  <tr>\r\n"
                + "                    <td width=\"100%\" height=\"27\" colspan=\"5\"/>\r\n"
                + "                  </tr>\r\n"
                + "                  <tr>\r\n"
                + "                    <td width=\"100%\" height=\"1\" colspan=\"5\" bgcolor=\"#bebebe\"/>\r\n"
                + "                  </tr>\r\n"
                + "                </tbody>\r\n"
                + "              </table>\r\n"
                + "            </td>\r\n"
                + "              <td width=\"3%\"> </td>\r\n"
                + "          </tr>\r\n"
                + "          <tr>\r\n"
                + "            <td width=\"100%\" height=\"30\" colspan=\"3\"/>\r\n"
                + "          </tr>\r\n"
                + "          <tr>\r\n"
                + "            <td width=\"6%\"> </td>\r\n"
                + "            <td width=\"88%\">\r\n"
                + "              <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#f8f8f8\" style=\"line-height:22px;font-family:Apple SD Gothic Neo,sans-serif,'맑은고딕',Malgun Gothic,'굴림',gulim;letter-spacing:-1px;color:#1e1e1e\">\r\n"
                + "                <tbody>\r\n"
                + "                  <tr>\r\n"
                + "                    <td width=\"100%\" height=\"15\" colspan=\"3\"/>\r\n"
                + "                  </tr>\r\n"
                + "                  <tr>\r\n"
                + "                      <td width=\"3%\"> </td>\r\n"
                + "                    <td width=\"94%\" style=\"font-size:14px;font-weight:bold\">\r\n"
                + "                      요청하지 않은 인증번호 메일을 받으셨나요?\r\n"
                + "                    </td>\r\n"
                + "                      <td width=\"3%\"> </td>\r\n"
                + "                  </tr>\r\n"
                + "                  <tr>\r\n"
                + "                    <td width=\"100%\" height=\"7\" colspan=\"3\"/>\r\n"
                + "                  </tr>\r\n"
                + "   				 <tr>"
                + "					   <td width=\"3%\"/>"
                + "					   <td width=\"94%\" style=\"font-size:12px;line-height:18px\">"
                + " 				     내 계정이 맞다면, 누군가 오타로 메일을 잘못 발송했을 수 있습니다.<br>"
                + " 				     계정이 도용된 것은 아니니 안심하세요."
                + "					   </td>"
                + "					   <td width=\"3%\"/>"
                + "					  </tr>"
                + "					  <tr>"
                + "  				   <td width=\"100%\" height=\"18\" colspan=\"3\"/>"
                + "					  </tr>"
                + "                </tbody>\r\n"
                + "              </table>\r\n"
                + "            </td>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "          </tr>\r\n"
                + "          <tr>\r\n"
                + "            <td width=\"100%\" height=\"30\" colspan=\"3\"/>\r\n"
                + "          </tr>\r\n"
                + "          <tr>\r\n"
                + "            <td width=\"100%\" height=\"1\" colspan=\"3\" bgcolor=\"#e6e6e6\"/>\r\n"
                + "          </tr>\r\n"
                + "          <tr>\r\n"
                + "            <td width=\"100%\" height=\"16\" colspan=\"3\"/>\r\n"
                + "          </tr>\r\n"
                + "          <tr>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "            <td width=\"88%\" style=\"font-size:12px;line-height:18px;font-family:Apple SD Gothic Neo,sans-serif,'맑은고딕',Malgun Gothic,'돋움',Dotum;letter-spacing:-1px;color:#767676\">\r\n"
                + "              본 메일은 발신전용입니다.\r\n"
                + "              Copyright © ChatPeople Corp. All rights reserved.\r\n"
                + "            </td>\r\n"
                + "              <td width=\"6%\"> </td>\r\n"
                + "          </tr>\r\n"
                + "          <tr>\r\n"
                + "            <td width=\"100%\" height=\"18\" colspan=\"3\"/>\r\n"
                + "          </tr>\r\n"
                + "      </table>\r\n"
                + "    </td>\r\n"
                + "  </tr>\r\n"
                + "  <tr>\r\n"
                + "    <td width=\"100%\" height=\"100\"/>\r\n"
                + "  </tr>\r\n"
                + "</tbody>\r\n"
                + "  \r\n"
                + "  </table>\r\n");        
        sb.append("</body>");
        sb.append("</html>");

        String msg = sb.toString();
		
		message.setText(msg, "utf-8", "html"); 		 // 내용
		message.setFrom(new InternetAddress(email)); // 보내는 사람

		mailSender.send(message);
		
	}
}
