import StyleSheet from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: Configuration.home.listing_item.offset,
  },
  title: {
    fontFamily: AppStyles.fontName.bold,
    fontWeight: 'bold',
    color: AppStyles.color.title,
    fontSize: 25,
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
});

export default styles;
