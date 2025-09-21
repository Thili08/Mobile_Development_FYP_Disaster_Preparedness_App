import { StyleSheet } from "react-native";

export default StyleSheet.create({
  homeContainer: {
    backgroundColor: 'white',
    padding: 16,
    justifyContent: 'flex-start',
  },
  center: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    backgroundColor: '#e0e7ef',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  blobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  blobSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  halfBlob: {
    flex: 1,
    marginHorizontal: 4,
    padding: 20,
  },
  resourceContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  resourceItem: {
    backgroundColor: '#eef3f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resourceDesc: {
    fontSize: 14,
    color: '#333',
  },
  resourceLink: {
    marginTop: 6,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  badgeIcon: {
    fontSize: 48,
  },
  badgeName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  badgeDescription: {
    fontSize: 16,
    color: '#666',
  },
  alertsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  optionButton: {
    backgroundColor: '#0a2344ff',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginVertical: 6,
    borderWidth: 2,
    borderColor: '#bae2e5ff',
  },
  checklistOption: {
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'black',
  },
  checklistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e5f5',
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
    shadowColor: 'black',
    elevation: 2,
    width: '100%',
  },
});