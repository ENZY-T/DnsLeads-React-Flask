from backend import create_app

sslc = "/etc/letsencrypt/live/whonear.xyz/fullchain.pem"
sslck = "/etc/letsencrypt/live/whonear.xyz/privkey.pem"

# if __name__ == "_main_":
#     app = create_app()
#     app.run(debug=True, allow_unsafe_werkzeug=True, ssl_context=(sslc, sslck))


# if __name__ == "_main_":
#    app = create_app()
# app.run(debug=True, host="0.0.0.0", allow_unsafe_werkzeug=True, ssl_context=(sslc, sslck))
#    app.run(debug=True, host="0.0.0.0", ssl_context=(sslc, sslck))

app = create_app()
app.run(host="0.0.0.0", debug=True)
