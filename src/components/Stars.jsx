export default function Stars({ value = 0 }) {
  const stars = []
  for (let i = 1; i <= 5; i += 1) {
    let icon = 'fa-regular fa-star'
    if (value >= i - 0.25) icon = 'fa-solid fa-star'
    else if (value >= i - 0.75) icon = 'fa-solid fa-star-half-stroke'
    stars.push(<i key={i} className={icon} />)
  }
  return (
    <span className="stars" role="img" aria-label={`${value} out of 5`}>
      {stars}
    </span>
  )
}
