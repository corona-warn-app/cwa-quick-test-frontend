enum CancellationSteps {
  NO_CANCEL = 0,
  CANCELED = 1,
  DOWNLOAD_REQUESTED = 2,
  NO_TEST_RECORD = 3,
  DOWNLOAD_READY = 4,
  DOWNLOADED = 5,
  DATA_DELETED = 6,
}

export default CancellationSteps;
