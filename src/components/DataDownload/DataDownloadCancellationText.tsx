import useGetCancellationText, { CancellationTextType } from '../../misc/useGetCancellationText';

const DataDownloadCancellationText = (props: any) => {
  const cancellationText = useGetCancellationText(CancellationTextType.DOWNLOAD);

  return (
    <>
      {cancellationText && (
        <p dangerouslySetInnerHTML={{ __html: cancellationText }} className='cancellation-text mb-5' />
      )}
    </>
  );
};

export default DataDownloadCancellationText;
