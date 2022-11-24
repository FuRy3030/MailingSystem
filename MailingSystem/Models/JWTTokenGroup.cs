namespace MailingSystem.Models
{
    public class JWTTokenGroup
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime AccessTokenExpirationTime { get; set; }

        public JWTTokenGroup(string accessToken, string refreshToken, DateTime accessTokenExpirationTime) 
        {
            AccessToken = accessToken;
            RefreshToken = refreshToken;
            AccessTokenExpirationTime = accessTokenExpirationTime;
        }
    }
}
