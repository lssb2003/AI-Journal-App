class JournalEntry < ApplicationRecord
  belongs_to :user

  VALID_EMOTIONS = %w[
    joy contentment sadness anxiety anger surprise love neutral
    fear excitement gratitude hope frustration disappointment pride
  ].freeze

  validates :title, presence: true
  validates :content, presence: true
  validates :primary_emotion, presence: true,
                            inclusion: { in: VALID_EMOTIONS }
  validates :emotion_intensity, presence: true,
                              numericality: { only_integer: true,
                                            greater_than_or_equal_to: 1,
                                            less_than_or_equal_to: 10 }
end
