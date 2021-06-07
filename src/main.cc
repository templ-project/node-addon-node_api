#ifndef BUILDING_NODE_EXTENSION
#define BUILDING_NODE_EXTENSION
#endif

#define if_unmet_nan_throw(call, thrower, error)                                                                       \
  if (!(call)) {                                                                                                       \
    thrower(error);                                                                                                    \
  }

#include <napi.h>

Napi::String Method(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  std::string result = "Hello ";

  if (info.Length() < 1) {
    result += "World";
  } else {
    if (!info[0].IsString()) {
      Napi::TypeError::New(env, "Invalid argument type; expecting string.").ThrowAsJavaScriptException();
      return Napi::String::New(env, "");
    }
  }

  result += info[0].As<Napi::String>().Utf8Value();
  result += "!";

  return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "hello"), Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(hello, Init)
