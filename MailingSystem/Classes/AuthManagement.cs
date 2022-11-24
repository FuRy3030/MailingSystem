using MailingSystem.Migrations;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Diagnostics;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MailingSystem.Classes
{
    public class AuthManagement
    {
        public static string GenerateJWTToken(string UserName, string Email, string RealName)
        {
            try
            {
                IConfigurationRoot Configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();

                var Issuer = Configuration["Jwt:Issuer"];
                var Audience = Configuration["Jwt:Audience"];
                var Key = Encoding.ASCII.GetBytes(Configuration["Jwt:Key"]);

                var TokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim("Id", Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.Name, UserName),
                        new Claim(JwtRegisteredClaimNames.GivenName, RealName),
                        new Claim(JwtRegisteredClaimNames.Email, Email),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    }),
                    Expires = DateTime.UtcNow.AddHours(1),
                    Issuer = Issuer,
                    Audience = Audience,
                    SigningCredentials = new SigningCredentials
                    (new SymmetricSecurityKey(Key),
                    SecurityAlgorithms.HmacSha512Signature)
                };

                var TokenHandler = new JwtSecurityTokenHandler();
                var Token = TokenHandler.CreateToken(TokenDescriptor);
                var StringToken = TokenHandler.WriteToken(Token);
                return StringToken;
            }
            catch
            {
                return "Error";
            }
        }
        public static string GenerateRefreshToken()
        {
            byte[] RandomNumber = new byte[64];
            using var RNG = RandomNumberGenerator.Create();
            RNG.GetBytes(RandomNumber);
            return Convert.ToBase64String(RandomNumber);
        }

        public static string RandomString(int Size, bool LowerCase = false)
        {
            Random random = new Random();
            var Builder = new StringBuilder(Size); 
            char Offset = LowerCase ? 'a' : 'A';
            const int lettersOffset = 26;  

            for (var i = 0; i < Size; i++)
            {
                var @char = (char) random.Next(Offset, Offset + lettersOffset);
                Builder.Append(@char);
            }

            return LowerCase ? Builder.ToString().ToLower() : Builder.ToString();
        }
    }
}
