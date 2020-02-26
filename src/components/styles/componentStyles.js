import StyleSheet from 'react-native';
const styles = StyleSheet.create({
  btnClickContain: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  btnIcon: {
    height: 25,
    width: 25,
  },
  btnText: {
    fontFamily: AppStyles.fontName.bold,
    fontSize: 16,
    marginLeft: 10,
    marginTop: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
});
