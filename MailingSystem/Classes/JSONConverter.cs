using Newtonsoft.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MailingSystem.Classes
{
    public class ConcreteConverter<T> : Newtonsoft.Json.JsonConverter
    {
        public override bool CanConvert(Type objectType) => true;

        public override object ReadJson(JsonReader reader,
         Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            return serializer.Deserialize<T>(reader);
        }

        public override void WriteJson(JsonWriter writer,
            object value, Newtonsoft.Json.JsonSerializer serializer)
        {
            serializer.Serialize(writer, value);
        }
    }
}
