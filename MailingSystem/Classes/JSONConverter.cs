using Newtonsoft.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MailingSystem.Classes
{
    //public class CustomJsonConverterForType : JsonConverter<Type>
    //{
    //    public override Type Read(
    //        ref Utf8JsonReader reader,
    //        Type typeToConvert,
    //        JsonSerializerOptions options
    //        )
    //    {
    //        // Possible:
    //        // string assemblyQualifiedName = reader.GetString();
    //        // return Type.GetType(assemblyQualifiedName);
    //        throw new NotSupportedException();
    //    }

    //    public override void Write(
    //        Utf8JsonWriter writer,
    //        Type value,
    //        JsonSerializerOptions options
    //        )
    //    {
    //        string assemblyQualifiedName = value.AssemblyQualifiedName;
    //        writer.WriteStringValue(assemblyQualifiedName);
    //    }
    //}

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
