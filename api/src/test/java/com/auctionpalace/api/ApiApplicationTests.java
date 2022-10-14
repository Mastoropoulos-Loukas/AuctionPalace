package com.auctionpalace.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class ApiApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void generatePasswords(){
		String raw = null;
		PasswordEncoder encoder = new BCryptPasswordEncoder();

		raw = "gPeD827F";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "ArPNnM9P";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "WybVw6Hh";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "ap4x8FTU";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "juTazTjC";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "dfuDDSkc";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "TXy337cD";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "Bep5sxLa";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "czFvTx3e";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "BfQ9JMxt";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "C9WuvxdP";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "zRrwSSZ2";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "xYKEXkpA";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "bFqsP6jU";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
		raw = "admin";
		System.out.println("\n(" + raw + "):\n" + encoder.encode(raw)+"\n");
	}

}
