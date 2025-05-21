package com.abdallah.ElectornicApp_online_backend.utility;

import com.auth0.jwk.*;
import com.auth0.jwt.interfaces.RSAKeyProvider;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public class Auth0RSAKeyProvider implements RSAKeyProvider {

    private final UrlJwkProvider jwkProvider;

    public Auth0RSAKeyProvider(String domain) {

        this.jwkProvider = new UrlJwkProvider("https://" + domain + "/");
    }

    @Override
    public RSAPublicKey getPublicKeyById(String keyId) {
        try {
            Jwk jwk = jwkProvider.get(keyId);
            return (RSAPublicKey) jwk.getPublicKey();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load public key", e);
        }
    }

    @Override
    public RSAPrivateKey getPrivateKey() {
        return null;
    }

    @Override
    public String getPrivateKeyId() {
        return null;
    }
}
