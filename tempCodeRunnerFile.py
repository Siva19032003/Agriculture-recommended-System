# Function to recommend a crop based on user input
# def recommend_crop(N, P, K, temperature, humidity, ph, rainfall):
#     input_data = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]], columns=X.columns)
#     predicted_label = xgb_model.predict(input_data)[0]
#     recommended_crop = label_encoder.inverse_transform([predicted_label])[0]
#     return recommended_crop

# # Example usage
# N = int(input("enter a Nitrogen Value :"))
# P= int(input("enter a Phosporus Value :"))

# K=int(input("enter a Potassium Value :")) 
# temperature = int(input("enter a temperature Value :"))
# humidity= int(input("enter a Humidity Value :"))
# ph = int(input("enter a Ph Value :"))
# rainfall = int(input("enter a Rainfall Value :"))
# recommended_crop = recommend_crop(N, P, K, temperature, humidity, ph, rainfall)
# print(f"Recommended Crop: {recommended_crop}")
