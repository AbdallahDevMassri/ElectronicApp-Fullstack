package com.abdallah.ElectornicApp_online_backend.config;

import com.abdallah.ElectornicApp_online_backend.utility.Auth0RSAKeyProvider;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.RSAKeyProvider;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;

@Component
public class UserAuthenticationProvider {

    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    @Value("${auth0.domain}")
    private String auth0Domain;

    @Value("${auth0.issuer}")
    private String auth0Issuer;

    @PostConstruct
    protected void init() {
        // this is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String login) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(login)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(algorithm);
    }


    public Authentication validateToken(String token) {
        DecodedJWT decodedJWT = JWT.decode(token);
        String alg = decodedJWT.getAlgorithm();

        JWTVerifier verifier;

        if ("RS256".equals(alg)) {
            RSAKeyProvider keyProvider = new Auth0RSAKeyProvider(auth0Domain);
            Algorithm rs256 = Algorithm.RSA256(keyProvider);
            verifier = JWT.require(rs256)
                    .withIssuer(auth0Issuer)
                    .acceptNotBefore(120)
                    .acceptLeeway(120)
                    .build();
        } else if ("HS256".equals(alg)) {
            Algorithm hs256 = Algorithm.HMAC256(secretKey);
            verifier = JWT.require(hs256)
                    .acceptNotBefore(120)
                    .acceptLeeway(120)
                    .build();
        } else {
            throw new IllegalArgumentException("Unsupported JWT algorithm: " + alg);
        }

        DecodedJWT decoded = verifier.verify(token);

        String userId = decoded.getSubject();
        return new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
    }


}
