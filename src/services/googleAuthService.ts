import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

export class GoogleAuthService {
    private oauth2Client: OAuth2Client;

    constructor(clientId: string, clientSecret: string, redirectUri: string) {
        this.oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
    }

    public async authenticateUser(code: string): Promise<{ tokens: any; userInfo?: any }> {
        const tokenResponse = await this.getToken(code);
        const tokens = tokenResponse.tokens || tokenResponse;
        // set credentials for subsequent requests if needed
        this.oauth2Client.setCredentials(tokens);

        // try to get user info using access_token (fallback to id_token if needed)
        const accessToken = tokens.access_token || tokens.id_token;
        let userInfo;
        if (accessToken) {
            try {
                userInfo = await this.getUserInfo(accessToken);
            } catch (err) {
                
            }
        }

        return { tokens, userInfo };
    }

    private async getToken(code: string): Promise<any> {
        if (!code) throw new Error('Authorization code is required.');
        const res = await this.oauth2Client.getToken(code);
        return res;
    }

    public async getUserInfo(accessToken: string): Promise<any> {
        if (!accessToken) throw new Error('Access token is required to fetch user info.');
        const url = 'https://openidconnect.googleapis.com/v1/userinfo';
        const resp = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return resp.data;
    }
}