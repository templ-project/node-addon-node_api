{
  "targets": [
    {
      "target_name": "main",
      "sources": [
        "src/main.cc"
      ],
      "link_settings": {},
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS'],
      "cflags_cc": [
        "-std=c++11"
      ],
      "cflags_cc!": [
        "-std=gnu++1y"
      ]
    }
  ]
}
