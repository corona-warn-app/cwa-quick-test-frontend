import useGetCancellationText, { CancellationTextType } from '../../misc/useGetCancellationText';

const LandingCancellationText = (props: any) => {
  const cancellationText = useGetCancellationText(CancellationTextType.LANDING);

  return (
    <>
      {cancellationText && (
        <p dangerouslySetInnerHTML={{ __html: cancellationText }} className='cancellation-text mb-5' />
      )}
    </>
  );
};

export default LandingCancellationText;
